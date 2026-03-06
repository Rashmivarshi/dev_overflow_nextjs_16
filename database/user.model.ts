import { model, models, Schema } from "mongoose";

export interface Iuser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}
const UserSchema = new Schema<Iuser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number },
  },
  { timestamps: true },
);

const User = models?.User || model<Iuser>("User", UserSchema);
export default User;
