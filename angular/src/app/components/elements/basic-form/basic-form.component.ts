import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent {

  production = environment.production;

  @Input() form: FormGroup;
  @Output() submitted: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  version = environment.versions.app + '-' + environment.envName.toLowerCase();
  year = new Date().getFullYear();

  onSubmit() {
    if (this.form.valid) {
      this.submitted.emit();
    }
  }

}
