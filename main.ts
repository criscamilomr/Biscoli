import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import 'zone.js';

import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations()
    ]
}).catch((err) => console.error(err));
