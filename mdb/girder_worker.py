from girder_worker import GirderWorkerPluginABC

class MDBPlugin(GirderWorkerPluginABC):
    def __init__(self, app, *args, **kwargs):
        self.app = app

    def task_imports(self):
        print('tasks')
        return ['mdb.tasks.validation']
