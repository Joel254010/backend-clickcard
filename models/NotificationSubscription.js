import mongoose from 'mongoose';

const notificationSubscriptionSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
  subscription: {
    endpoint: String,
    keys: {
      auth: String,
      p256dh: String
    }
  }
});

const NotificationSubscription = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

export default NotificationSubscription;
