import Agenda, { AgendaConfig, Job } from "agenda";

class JobScheduler {
  private agenda_: Agenda;
  constructor(config: AgendaConfig) {
    this.agenda_ = new Agenda(config);
  }
  start = async () => {
    await this.agenda_.start();
  };

  stop = async () => {
    await this.agenda_.stop();
  };

  define_task = (task_name: string, callback: any) => {
    this.agenda_.define(task_name, callback);
  };

  schedule_task = async (time: string, task_name: string, data?: any) => {
    const res = await this.agenda_.schedule(time, task_name, data);
    return res;
  };

  repeat_task = async (time: string, task_name: string, data?: any) => {
    const res = await this.agenda_.every(time, task_name, data);
    return res;
  };
}

export default JobScheduler;
