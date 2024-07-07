import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey: string = environment.encryptionKey;

  constructor() { }

  private getKeySpec(key: string): any {
    const hashedKey = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(key)).toString(CryptoJS.enc.Hex);
    return CryptoJS.enc.Hex.parse(hashedKey.substring(0, 32)); // use first 16 bytes (32 hex chars) for AES-128
  }

  private getIvSpec(key: string): any {
    const ivMd5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(key)).toString(CryptoJS.enc.Hex);
    return CryptoJS.enc.Hex.parse(ivMd5Hash);
  }

  encryptPassword(password: string): string {
    const keySpec = this.getKeySpec(this.secretKey);
    const ivSpec = this.getIvSpec(this.secretKey);

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), keySpec, {
      iv: ivSpec,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  decryptPassword(encryptedPassword: string): string {
    const keySpec = this.getKeySpec(this.secretKey);
    const ivSpec = this.getIvSpec(this.secretKey);

    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keySpec, {
      iv: ivSpec,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
