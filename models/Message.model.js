const { Schema, model } = require('mongoose')

const MessageSchema = new Schema(
  {
    to: Schema.Types.ObjectId,
    from: Schema.Types.ObjectId,
    message: String,
    room: { type: String, required: true },
    author: String
  },
  {
    timestamps: true
  }
)

const MessageModel = model("Message", MessageSchema);

module.exports = MessageModel;
