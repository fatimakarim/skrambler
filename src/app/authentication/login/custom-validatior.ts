import { AbstractControl, FormGroup } from '@angular/forms';

export function passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const cnfpassValue = control.value;

        const passControl = control.root.get('new_password');
        if (passControl) {
            const passValue = passControl.value;
            if (passValue !== cnfpassValue) {
                return {
                    isError: true
                };
            }
        }
    }
    return null;
}