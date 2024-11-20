import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../interface/widget';
import { HistoryComponent } from '../dashboard/widget/history/history.component';
import { MyCommentComponent } from '../dashboard/widget/my-comment/my-comment.component';
import { ProfileInfoComponent } from '../dashboard/widget/profile-info/profile-info.component';
import { ButtonBoxComponent } from '../dashboard/widget/button-box/button-box.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]> ([
    {
    id:1,
    label:'reservation history',
    content: HistoryComponent,
    rows:3 ,
    columns:2 ,
    
  },
    {
    id:2,
    label:'comment history',
    content: MyCommentComponent,
    rows:2 ,
    columns:2 ,
  },
    {
    id:3,
    label:'profile info',
    content: ProfileInfoComponent,
    rows:2 ,
    columns:2 ,
  },
    {
    id:4,
    label:'button box',
    content:ButtonBoxComponent ,
    rows:1 ,
    columns:1 ,
  },
])

addedWidgets =signal<Widget[]>([]);
 widgetsToAdd = computed(() => {
  const addedIds = this.addedWidgets().map(w => w.id);
  return this.widgets().filter(w => !addedIds.includes(w.id))
 }
 )


 addWidget(w:Widget){
  this.addedWidgets.set([...this.addedWidgets(), {...w}])
}

fetchWidgets(){
  const widgetAsString = localStorage.getItem('dashboardWidget');
  if(widgetAsString){
const widgets = JSON.parse(widgetAsString) as Widget[];
widgets.forEach(widget => {
  const content = this.widgets().find(w => w.id === widget.id)?.content;
  if(content){
    widget.content= content;
  }
})
this.addedWidgets.set(widgets);
  }
}



updateWidget(id:number,widget:Partial<Widget>){
  const index =this.addedWidgets().findIndex(w => w.id === id);
  if (index !== -1){
    const newWidgets = [...this.addedWidgets()];
    newWidgets[index] = {...newWidgets[index], ...widget}
    this.addedWidgets.set(newWidgets)
  }
}

moveWidgetToRight(id:number){
const index = this.addedWidgets().findIndex(w => w.id === id);
if(index === this.addedWidgets().length - 1){
  return;
}

  const newWidgets = [...this.addedWidgets()];
  [newWidgets[index], newWidgets[index + 1]] = [{...newWidgets[index + 1] } , {...newWidgets[index] }] 
this.addedWidgets.set(newWidgets);

}
moveWidgetToLeft(id:number){
  const index = this.addedWidgets().findIndex(w => w.id === id);
  if(index === 0 ){
    return;
  }
  
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [{...newWidgets[index - 1] } , {...newWidgets[index] }] 
  this.addedWidgets.set(newWidgets);
  
}
removeWidget(id:number){
  this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id))
}


  constructor() {
    this.fetchWidgets()
   }


saveWidget= effect(() => {
  const widgetWithoutContent:Partial<Widget>[] = this.addedWidgets().map(w => ({...w}));
  widgetWithoutContent.forEach(w => {
    delete w.content;
  })
  localStorage.setItem('dashboardWidget', JSON.stringify(widgetWithoutContent));
})

}
