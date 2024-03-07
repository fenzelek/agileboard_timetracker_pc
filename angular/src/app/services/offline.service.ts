import { Injectable } from "@angular/core";
import { TimeStore } from "src/core/timeStore/timeStore";
import { Cache } from "./cache/cache";
import { NativeService } from "./native.service";


@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  cache = new Cache();

  constructor(
    private nativeService: NativeService,
    private timeStore: TimeStore,
  ) { }

  shouldShowNoInternet(): boolean {
    const onlineMode = !this.timeStore.isOffline;
    const noNetworkConnection = !this.nativeService.networkOnline;

    if (onlineMode && noNetworkConnection) {
      return true;
    } else {
      return false;
    }
  }

}
