import { ChangeDetectorRef, Component, Output, EventEmitter } from '@angular/core';
import { ProjectsFacade } from "../../../../core/store/projects/projects.facade";
import { TimeStore } from 'src/core/timeStore/timeStore';
import { DesktopProjectsComponent } from '../../desktop/desktop-projects/desktop-projects.component';


@Component({
  selector: 'app-mobile-project-list',
  templateUrl: './mobile-project-list.component.html',
  styleUrls: ['./mobile-project-list.component.scss']
})
export class MobileProjectListComponent extends DesktopProjectsComponent {
  @Output() clickSelected: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    protected projectFacade: ProjectsFacade,
    protected timeStore: TimeStore,
    protected cd: ChangeDetectorRef,
  ) {
    super(
      projectFacade,
      timeStore,
      cd,
      null
    );
   }

  //  override
  selectProject(id: number) {
    this.projectFacade.setSelected(id);
    this.clickSelected.emit();
  }
}
