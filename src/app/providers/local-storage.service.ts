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
}
