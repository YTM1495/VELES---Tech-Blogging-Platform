
import User from "../models/user.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not configured");

    return res.status(500).json({
      message: "Webhook configuration error",
    });
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);

    return res.status(400).json({
      message: "Webhook verification failed",
    });
  }

  try {
    if (evt.type === "user.created") {
      const email = evt.data.email_addresses?.[0]?.email_address;

      if (!email) {
        return res.status(400).json({
          message: "User email not found",
        });
      }

      await User.findOneAndUpdate(
        { clerkUserId: evt.data.id },
        {
          $set: {
            username: evt.data.username || email,
            email,
            img: evt.data.image_url,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    if (evt.type === "user.deleted") {
      await User.findOneAndDelete({
        clerkUserId: evt.data.id,
      });
    }

    return res.status(200).json({
      message: "Webhook received",
    });

  } catch (err) {
    console.error("Webhook processing failed:", err);

    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};
