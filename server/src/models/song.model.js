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
      url: {
        type: String,
        default: "",
        trim: true,
      },
      key: {
        type: String,
        default: "",
        trim: true,
      },
      source: {
        type: String,
        enum: ["external", "upload"],
        default: "external",
      },
    },
    lyrics: {
      type: String,
      required: true,
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
