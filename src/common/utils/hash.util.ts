// src/common/utils/hash.util.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashUtil {
    constructor() {}

    /**
     * Hash password
     * @param plainText Original password
     * @param saltRounds Number of salt rounds (default = 10)
     * @returns Hashed password string
     */
    static async hashPassword(plainText: string, saltRounds = 10): Promise<string> {
            
        if (!plainText) throw new Error('Password is required for hashing');
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainText, salt);
    }

    /**
     * Compare input password with hash in DB
     * @param plainText Password entered by user
     * @param hashed Password stored in DB
     * @returns true if matched
    */
    static async comparePassword(plainText: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hashed);
    }

    /**
     * Generate hash string from any data (used for token, key, etc.)
     */
    static async hashData(data: string): Promise<string> {
            const salt = await bcrypt.genSalt(8);
            return await bcrypt.hash(data, salt);
    }
}
