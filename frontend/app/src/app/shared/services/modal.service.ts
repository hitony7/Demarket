import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalVisibility = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibility.asObservable();

  // Show the login modal
  showModal() {
    this.modalVisibility.next(true);
  }

  // Hide the login modal
  hideModal() {
    this.modalVisibility.next(false);
  }
}
