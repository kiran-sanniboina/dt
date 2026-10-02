import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college-project-hub';

  try {
    // Set a short server selection timeout so fallback triggers quickly if local mongo is down
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to MongoDB at ${uri}. Launching in-memory MongoDB fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] In-memory MongoDB connected successfully at ${memUri}`);
    } catch (memError) {
      console.error('[Database] Failed to initialize in-memory database:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
