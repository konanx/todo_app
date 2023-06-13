export interface ListaZadanIE {
  _id: string;
  name: string;
}
export interface SingleTaskIE {
  user_id: string;
  list_id: string;
  name: string;
  created: number;
  done: boolean;
  fav: boolean;
  _id: string;
}
export interface statsIE {
  created_tasks: string;
  completed_tasks: string;
  deleted_tasks: string;
  account_createdAt: any;
  fav_current_tasks: string;
  current_tasks: string;
  completed_tasks_percent: string;
  deleted_tasks_percent: string;
  created_lists: string;
  today_created_tasks: string;
  today_done_tasks: string;
}
export interface listSettingsIE {
  _id: string;
  name: string;
  open: boolean;
}
export interface listSettingsResponseIE {
  displayCompleted: boolean;
}
