// src/common/utils/encrypt.utils.ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

export class EncryptUtil {
  private static readonly algorithm = 'aes-256-ctr';

  private static readonly secretKey = scryptSync(
    process.env.ENCRYPTION_KEY || 'default-secret-key',
    'salt',
    32
  );

  static encrypt(text: string): string {
    if (!text) return text; 

    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  static decrypt(hash: string): string {
    if (!hash) return hash;

    const [ivHex, encryptedHex] = hash.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.secretKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
