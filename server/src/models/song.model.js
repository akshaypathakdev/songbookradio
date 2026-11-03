import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    albumOrMovie: {
      type: String,
      trim: true,
      default: "",
    },
    musicDirector: {
      type: String,
      trim: true,
      default: "",
    },
    singers: {
      type: [String],
      required: true,
      validate: {
        validator: (singers) => singers.length > 0,
        message: "At least one singer is required.",
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
    },
  },
  {
    timestamps: true,
  },
);

const Song = mongoose.model("Song", songSchema);

export default Song;
