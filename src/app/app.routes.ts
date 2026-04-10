import { Routes } from '@angular/router';
import { UploadReviewComponent } from './Views/upload-review/upload-review';
import { ViewReviewComponent } from './Views/upload-review/viewReviews';
import { ViewUploadInterredPhotoComponent } from './Views/upload-interred-photo/viewUploads';
import { UploadInterredPhotoComponent } from './Views/upload-interred-photo/upload-interred-photo';
import { IntermentsLandingComponent } from './Views/interments-landing/landing';
import { SlideshowComponent } from './Views/slideshow/slideshow';
import { IsUploadedReviewEmail } from './Views/isUploadedReviewEmail/is-uploaded-review-email';
import { PhotolinkuploadComponent } from './Views/photolinkupload/photolinkupload';
import { SupplierIoMenuComponent } from './Views/supplierio/menu/menu';
import { SupplierItemsComponent } from './Views/supplierio/items/items';
import { SupplierItemAssignmentComponent } from './Views/supplierio/item-assignment/item-assignment';
import { NlioSupplierAssignmentComponent } from './Views/supplierio/nlio-assignment/nlio-assignment';
import { DiscordUserComponent } from './Views/supplierio/discord/discord';

export const routes: Routes = [
  { path: 'interments', component: IntermentsLandingComponent },
  { path: 'interments/:document_no', component: IntermentsLandingComponent },
  { path: 'intermentsReviewLink/:document_no', component: UploadReviewComponent },
  { path: 'intermentsUploadInterredPhotoLink_ForPost/:document_no', component: UploadInterredPhotoComponent },
  { path: 'isReviewedEmail', component: IsUploadedReviewEmail },
  { path: 'allReviews', component: ViewReviewComponent },
  { path: 'lapidaDashboard', component: ViewUploadInterredPhotoComponent },
  { path: 'slideshow/:document_no', component: SlideshowComponent },
  { path: 'photolinkupload/:document_no', component: PhotolinkuploadComponent },
  { path: 'supplierio', component: SupplierIoMenuComponent },
  { path: 'supplierio/items', component: SupplierItemsComponent },
  { path: 'supplierio/item-assignment', component: SupplierItemAssignmentComponent },
  { path: 'supplierio/nlio-assignment', component: NlioSupplierAssignmentComponent },
  { path: 'supplierio/discord', component: DiscordUserComponent },
  { path: '**', redirectTo: 'interments', pathMatch: 'full' }
];
