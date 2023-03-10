const mongoose = require('mongoose');
const jsonResponse = require('../utils/jsonResponse');
const underscore = require('underscore');
const Bookings = require('../models/bookings');
const Centers = require('../models/centers');


exports.add = async (req, res, next) => {
    const { nric_number, full_name, center, slot } = req.body;


    if(new Date() > new Date(slot))
        return jsonResponse(res, 0, 'Please select future date and time');

    const getCenter = await Centers.findOne({number: center})

    
    
    const start = new Date(slot)

    start.setHours(0,0,0,0);

    var end = new Date(slot);
    end.setHours(23,59,59,999);
    
    
    const totalBookings = await Bookings.aggregate([
        {
            
            $match: { slot: { $gte: start, $lt: end }, center, isActive: true }
        },
        {
            
                $group : {
                   _id :{ $dateToString: { format: "%Y-%m-%d", date: "$slot"} },
                   count: { $sum: 1 }
                }
        },
        {
            $project: { date: "$_id", count: "$count"}
        }

        ])

    var startTime = new Date(slot)
    var endTime = new Date(slot);
    var minutes = endTime.setMinutes(endTime.getMinutes()+1)
  
   

        const nursesSlots = await Bookings.aggregate([
            {
                
                $match: { slot: { $gte: startTime, $lt: endTime }, center, isActive: true }
            },
            {
                
                    $group : {
                       _id :{ $dateToString: { format: "%Y-%m-%d %H:%M", date: "$slot"} },
                       count: { $sum: 1 }
                    }
            },
            {
                $project: { date: "$_id", count: "$count"}
            }
    
            ])

                  

    if(totalBookings[0]?.count == getCenter.dailyCapacity)
        return jsonResponse(res, 0, 'Center capacity exceeded for this date');


    if(nursesSlots[0]?.count == getCenter.totalNurses)
        return jsonResponse(res, 0, 'No Nurse available at selected slot');

    
    var centerStart = getCenter.startTime
    var centerEnd = getCenter.endTime



    if(!(new Date(slot).getHours() >= centerStart && new Date(slot).getHours() <= centerEnd ))
        return jsonResponse(res, 0, 'No Nurse available at selected slot');


    const isExist = await Bookings.findOne({nric_number: nric_number, isActive: true});
    
    if (isExist) {
        return jsonResponse(res, 0, 'Booking already exist for this user');
    }
    
    if (!nric_number || !full_name || !center || !slot) {
        return jsonResponse(res, 0, 'Please provide all fields');
    }
    
    const booking = await Bookings.create({ nric_number, full_name, center, slot });

    jsonResponse(res, 1, 'Successfully registered!', booking);
    return;
}


exports.get = async (req, res, next) => {
   
    const bookingsList = await Bookings.find({isActive: true});
    return jsonResponse(res, 1, 'Successfully', bookingsList);
}


exports.getSingle = async (req, res, next) => {
    const { id } = req.params;
    
    const booking = await Bookings.findOne({_id: id, isActive: true});

    if(booking)
        return jsonResponse(res, 1, 'Successfully', booking);
    else
        return jsonResponse(res, 0, 'Booking does not exist');
}


exports.update = async (req, res, next) => {
    const { id } = req.params;
    const { nric_number, full_name, center, slot } = req.body;

    var booking = await Bookings.findOne({ _id: id, isActive: true });
    if (!booking) {
        return jsonResponse(res, 0, 'Invalid booking');
    }


    if (!nric_number || !full_name || !center || !slot) {
        return jsonResponse(res, 0, 'Please provide all fields');
    }


    booking.nric_number = nric_number;
    booking.full_name = full_name;
    booking.center = center;
    booking.slot = slot;
    await booking.save();

    return jsonResponse(res, 1, 'Booking updated successfully', booking);
}


exports.delete = async (req, res, next) => {
    const { id } = req.params;
    var booking = await Bookings.findOne({ _id: id, isActive: true });
    if (!booking) {
        return jsonResponse(res, 0, 'Invalid id');
    }
    booking.isActive = false;
    await booking.save();
    return jsonResponse(res, 1, 'Booking deleted!');
}
