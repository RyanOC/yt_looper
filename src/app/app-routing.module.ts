import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { LibraryComponent } from './library/library.component';

const routes: Routes = [
  { path: '', component: EditorComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'yt_looper/editor', component: EditorComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'yt_looper/library', component: LibraryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
