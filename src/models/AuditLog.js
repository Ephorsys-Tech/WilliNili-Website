import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    adminEmail: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetModel: {
      type: String,
      default: '',
    },
    targetId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
