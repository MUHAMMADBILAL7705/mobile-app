import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageService {
  addValuesToStorage(): void {
    throw new Error("Method not implemented.");
  }

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello StorageServiceProvider Provider');
  }

  public addToStorage(key, value): void {
    this.setStorage(key, value);
  }

  private setStorage(key, value) {
    return this.storage.set(`setting:${ key }`, value);
  }

  public async getFromStorage(key) {
    return await this.storage.get(`setting:${ key }`)
  }

  public async deleteFromStorage(key) {
    return await this.storage.remove(`setting:${key}`)

  }

}
