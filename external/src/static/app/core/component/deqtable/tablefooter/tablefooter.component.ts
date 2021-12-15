import { Component, Input } from '@angular/core';


@Component({
  selector: 'mydeq-paginator',
  templateUrl: './tablefooter.component.html'
})
export class TablefooterComponent{

  @Input() pagination_details
  @Input() go_to_page
  @Input() move_forward
  @Input() move_backward

}
