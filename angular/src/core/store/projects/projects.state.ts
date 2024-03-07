import { ProjectEntity } from './projects.model';


export interface ProjectsState {
  list: ProjectEntity[];
  loading: boolean;
  selectedId: number;
}
