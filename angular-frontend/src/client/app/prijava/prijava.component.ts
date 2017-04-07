import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'prijava',
  templateUrl: 'prijava.html'
})
export class PrijavaComponent {
  public loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(public fb: FormBuilder) {}
  doLogin(event: any) {
	//TODO: logika za prijavo
    console.log(event);
    console.log(this.loginForm.value);
  }
}
