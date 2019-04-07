const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Model Trip
const tripSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    categorie: {
        type: String
    },

    location: {
        type: String,
        trim: true,
        required: true
    },
    image: [{
        type: String,
        required:false
    }],
    
    description: {
        type: String,
        trim: true,
        required: true,
    },
    _author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
        
    },
    created: {
        type: Date,
        default: Date.now
    },
    
    _comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    rating: {
        type: Number
    }

});
const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;