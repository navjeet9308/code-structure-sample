import { Schema } from 'mongoose';

const BaseSchema = new Schema(
    {
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: String},
        lastUpdatedBy: { type: String},
    }
);

export default BaseSchema;