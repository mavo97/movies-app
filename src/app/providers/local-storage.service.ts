import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getItem(itemName: string): string {
    return localStorage.getItem(itemName);
  }

  setItem(itemName: string, itemValues: string) {
    localStorage.setItem(itemName, itemValues);
  }

  setExpiry() {
    const currentTime = new Date();
    const expiryTime = currentTime.getTime() + 4.32e7;
    const finalHour = new Date(expiryTime);
    localStorage.setItem('expiryTime', JSON.stringify(finalHour.toString()));
  }

  compareTime(): boolean {
    const expiryTime: Date = JSON.parse(localStorage.getItem('expiryTime'));
    const currentTime: number = new Date().getTime();
    const timeToCompare: number = new Date(expiryTime).getTime();
    console.log(expiryTime, 'expiry');
    console.log(new Date());
    return timeToCompare > currentTime ? false : true;
  }
}
