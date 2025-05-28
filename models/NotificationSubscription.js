import mongoose from 'mongoose';

const notificationSubscriptionSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
    unique: true, // ✅ Evita duplicações por empresa
  },
  subscription: {
    endpoint: { type: String, required: true },
    keys: {
      auth: { type: String, required: true },
      p256dh: { type: String, required: true }
    }
  }
}, {
  timestamps: true // ✅ Cria campos createdAt e updatedAt automaticamente
});

const NotificationSubscription = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

export default NotificationSubscription;
