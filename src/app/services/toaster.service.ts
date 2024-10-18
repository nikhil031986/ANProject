import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Correct service from ngx-toastr

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  options: any;

  constructor(private toastr: ToastrService) {
    this.options = {
      closeButton: true,
      enableHTML: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    };
  }

  success(message: string, title?: string): void {
    this.toastr.success(message, title, this.options);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title, this.options);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title, this.options);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title, this.options);
  }
}