const mongoose = require("mongoose");

const objects = new mongoose.Schema({
    garageNumber: {
        type: String,

    },
    id: {
        type: Number,
    },
    mnfID: {
        type: String,
    },
    objectName: {
        type: String,
    },
    objectType: {
        type: String,
    },

    phone: {
        type: String,
    },
    assignType: { // 0 => unassign, 1=> QC1, 2=> QC2, 3=> QC3, 4=> QC4, 5=> Land Side, 6=>House Keeping, 7=> Rail
        type: Number,
        default: 0
    },
    groupList: {
        group: {
            groupName: {
                type: String
            },
            ID: {
                type: Number
            }
        }
    }
});

module.exports = Objects = mongoose.model("objects", objects);