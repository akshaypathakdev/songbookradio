import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 250,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    albumOrMovie: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },
    musicDirector: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },
    singers: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 100,
        },
      ],
      required: true,
      validate: {
        validator: (singers) => singers.length > 0 && singers.every(Boolean),
        message: "At least one valid singer is required.",
      },
    },
    artwork: {
      source: {
        type: String,
        enum: ["upload", "external"],
      },
      key: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
      contentType: {
        type: String,
        default: "image/webp",
      },
    },
    lyrics: {
      key: {
        type: String,
        required: true,
        trim: true,
      },
      contentType: {
        type: String,
        default: "text/markdown",
      },
    },
    lyricist: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },
  },
  {
    timestamps: true,
  },
);

const Song = mongoose.model("Song", songSchema);

export default Song;
