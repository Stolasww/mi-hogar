import { useState, type FormEvent } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Home,
  ListTodo,
  Menu,
  Plus,
  Search,
  StickyNote,
  Wallet,
  X,
} from 'lucide-react';

type Page = 'Inicio' | 'Tareas' | 'Calendario' | 'Finanzas' | 'Notas';
type Task = { id: number; title: string; detail: string; done: boolean };

const navigation: { label: Page; icon: typeof Home }[] = [
  { label: 'Inicio', icon: Home },
  { label: 'Tareas', icon: ListTodo },
  { label: 'Calendario', icon: CalendarDays },
  { label: 'Finanzas', icon: Wallet },
  { label: 'Notas', icon: StickyNote },
];

const initialTasks: Task[] = [
  { id: 1, title: 'Organizar la lista del mercado', detail: 'Hoy · Cocina', done: false },
  { id: 2, title: 'Revisar los pagos del hogar', detail: 'Hoy · Finanzas', done: false },
  { id: 3, title: 'Regar las plantas', detail: 'Mañana · Casa', done: true },
];

const today = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date());

function App() {
  const [page, setPage] = useState<Page>('Inicio');
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = tasks.filter((task) => !task.done).length;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    setTasks((current) => [
      { id: Date.now(), title, detail: 'Hoy · Casa', done: false },
      ...current,
    ]);
    setNewTask('');
    setAddingTask(false);
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function navigate(nextPage: Page) {
    setPage(nextPage);
    setMenuOpen(false);
    setAddingTask(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#inicio" onClick={() => navigate('Inicio')}>
          <span className="brand-mark"><Home size={20} strokeWidth={2.4} /></span>
          <span>mi hogar<span className="brand-period">.</span></span>
        </a>

        <div className="sidebar-label">MENÚ PRINCIPAL</div>
        <nav className="main-nav" aria-label="Navegación principal">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${page === label ? 'nav-item-active' : ''}`}
              key={label}
              onClick={() => navigate(label)}
              aria-current={page === label ? 'page' : undefined}
            >
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
              {label === 'Tareas' && pendingCount > 0 && (
                <span className="nav-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-spark">✳</span>
            <p>Un hogar organizado empieza con pequeños pasos.</p>
          </div>
          <button className="profile-button" onClick={() => setPage('Inicio')}>
            <span className="avatar">H</span>
            <span className="profile-copy"><strong>Mi hogar</strong><small>Espacio personal</small></span>
            <ChevronDown size={16} className="profile-chevron" />
          </button>
        </div>
      </aside>

      {menuOpen && <button className="menu-scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="breadcrumb">Mi espacio <span>/</span> <strong>{page}</strong></div>
          <div className="topbar-actions">
            <span className="today-date">{today}</span>
            <button className="search-button" aria-label="Buscar" title="Buscar próximamente">
              <Search size={19} />
            </button>
            <span className="avatar topbar-avatar">H</span>
          </div>
        </header>

        <div className="page-content">
          {page === 'Inicio' ? (
            <Dashboard
              tasks={tasks}
              pendingCount={pendingCount}
              addingTask={addingTask}
              newTask={newTask}
              onAddTask={addTask}
              onNewTaskChange={setNewTask}
              onToggleTask={toggleTask}
              onStartAdding={() => setAddingTask(true)}
              onCancelAdding={() => { setAddingTask(false); setNewTask(''); }}
              onShowTasks={() => navigate('Tareas')}
              onNavigate={navigate}
            />
          ) : (
            <SectionPage
              page={page}
              tasks={tasks}
              pendingCount={pendingCount}
              addingTask={addingTask}
              newTask={newTask}
              onAddTask={addTask}
              onNewTaskChange={setNewTask}
              onToggleTask={toggleTask}
              onStartAdding={() => setAddingTask(true)}
              onCancelAdding={() => { setAddingTask(false); setNewTask(''); }}
            />
          )}
          <footer className="page-footer">Hecho para que tu hogar se sienta más ligero <span>♥</span></footer>
        </div>
      </main>
    </div>
  );
}

type TaskListProps = {
  tasks: Task[];
  addingTask: boolean;
  newTask: string;
  onAddTask: (event: FormEvent<HTMLFormElement>) => void;
  onNewTaskChange: (value: string) => void;
  onToggleTask: (id: number) => void;
  onStartAdding: () => void;
  onCancelAdding: () => void;
};

function TaskList({
  tasks,
  addingTask,
  newTask,
  onAddTask,
  onNewTaskChange,
  onToggleTask,
  onStartAdding,
  onCancelAdding,
}: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className={`task-row ${task.done ? 'task-done' : ''}`} key={task.id}>
          <button
            className="task-check"
            aria-label={task.done ? `Marcar ${task.title} como pendiente` : `Completar ${task.title}`}
            onClick={() => onToggleTask(task.id)}
          >
            {task.done ? <Check size={14} /> : <Circle size={19} strokeWidth={1.6} />}
          </button>
          <span className="task-copy">
            <span className="task-title">{task.title}</span>
            <span className="task-detail">{task.detail}</span>
          </span>
          <span className={`task-status ${task.done ? 'status-done' : ''}`}>
            {task.done ? 'Lista' : 'Pendiente'}
          </span>
        </div>
      ))}
      {addingTask && (
        <form className="add-task-form" onSubmit={onAddTask}>
          <input
            autoFocus
            aria-label="Nombre de la nueva tarea"
            placeholder="¿Qué necesitas hacer?"
            value={newTask}
            onChange={(event) => onNewTaskChange(event.target.value)}
          />
          <button className="icon-action save-task" type="submit" aria-label="Guardar tarea"><Check size={17} /></button>
          <button className="icon-action" type="button" aria-label="Cancelar" onClick={onCancelAdding}><X size={17} /></button>
        </form>
      )}
      {!addingTask && (
        <button className="add-task-button" onClick={onStartAdding}>
          <Plus size={17} /> Agregar tarea
        </button>
      )}
    </div>
  );
}

type DashboardProps = TaskListProps & {
  pendingCount: number;
  onShowTasks: () => void;
  onNavigate: (page: Page) => void;
};

function Dashboard({
  tasks,
  pendingCount,
  addingTask,
  newTask,
  onAddTask,
  onNewTaskChange,
  onToggleTask,
  onStartAdding,
  onCancelAdding,
  onShowTasks,
  onNavigate,
}: DashboardProps) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> TU ESPACIO, A TU RITMO</div>
          <h1>Un hogar en armonía<span>.</span></h1>
          <p className="welcome-subtitle">Organiza lo importante y disfruta más de cada día.</p>
        </div>
        <button className="primary-button" onClick={onStartAdding}><Plus size={18} /> Nueva tarea</button>
      </section>

      <section className="summary-grid" aria-label="Resumen del hogar">
        <article className="summary-card summary-card-tasks">
          <div className="summary-top"><span className="summary-icon icon-lavender"><ListTodo size={19} /></span><span className="summary-kicker">ORGANIZACIÓN</span></div>
          <div className="summary-value">{pendingCount}<span className="summary-unit">{pendingCount === 1 ? ' tarea pendiente' : ' tareas pendientes'}</span></div>
          <button className="text-link" onClick={onShowTasks}>Ver mis tareas <ArrowUpRight size={15} /></button>
        </article>
        <article className="summary-card">
          <div className="summary-top"><span className="summary-icon icon-green"><CalendarDays size={19} /></span><span className="summary-kicker">AGENDA</span></div>
          <div className="summary-value">0<span className="summary-unit"> eventos próximos</span></div>
          <button className="text-link" onClick={() => onNavigate('Calendario')}>Abrir calendario <ArrowUpRight size={15} /></button>
        </article>
        <article className="summary-card">
          <div className="summary-top"><span className="summary-icon icon-peach"><Wallet size={19} /></span><span className="summary-kicker">FINANZAS</span></div>
          <div className="summary-value">$0<span className="summary-unit"> COP este mes</span></div>
          <button className="text-link" onClick={() => onNavigate('Finanzas')}>Ver finanzas <ArrowUpRight size={15} /></button>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel tasks-panel">
          <div className="panel-heading">
            <div><div className="panel-overline">PARA TENER EN CUENTA</div><h2>Mis tareas</h2></div>
            <button className="subtle-button" onClick={onShowTasks}>Ver todas <ArrowUpRight size={15} /></button>
          </div>
          <TaskList
            tasks={tasks}
            addingTask={addingTask}
            newTask={newTask}
            onAddTask={onAddTask}
            onNewTaskChange={onNewTaskChange}
            onToggleTask={onToggleTask}
            onStartAdding={onStartAdding}
            onCancelAdding={onCancelAdding}
          />
        </article>

        <div className="right-column">
          <article className="panel agenda-panel">
            <div className="panel-heading">
              <div><div className="panel-overline">TU DÍA</div><h2>Próximamente</h2></div>
              <span className="date-badge"><CalendarDays size={15} /> Hoy</span>
            </div>
            <div className="empty-agenda">
              <span className="empty-icon"><Clock3 size={20} /></span>
              <strong>Tu agenda está despejada</strong>
              <span>Cuando agregues eventos, aparecerán aquí.</span>
              <button className="text-link" onClick={() => onNavigate('Calendario')}>Ir al calendario <ArrowUpRight size={15} /></button>
            </div>
          </article>
          <article className="balance-card">
            <div className="balance-card-top"><span>RESUMEN DEL MES</span><span className="balance-icon"><Wallet size={18} /></span></div>
            <div className="balance-amount">$0 <small>COP</small></div>
            <div className="balance-caption">Aún no hay movimientos registrados</div>
            <div className="balance-divider" />
            <div className="balance-bottom">
              <span><ArrowDownLeft size={15} /> Ingresos <strong>$0</strong></span>
              <span><ArrowUpRight size={15} /> Gastos <strong>$0</strong></span>
            </div>
          </article>
        </div>
      </section>

      <button className="notes-banner" onClick={() => onNavigate('Notas')}>
        <span className="notes-banner-icon"><StickyNote size={20} /></span>
        <span><strong>Un lugar para tus ideas</strong><small>Guarda recordatorios y notas importantes de tu hogar.</small></span>
        <span className="notes-banner-link">Explorar notas <ArrowUpRight size={16} /></span>
      </button>
    </>
  );
}

type SectionPageProps = TaskListProps & { page: Exclude<Page, 'Inicio'>; pendingCount: number };

function SectionPage({
  page,
  tasks,
  pendingCount,
  addingTask,
  newTask,
  onAddTask,
  onNewTaskChange,
  onToggleTask,
  onStartAdding,
  onCancelAdding,
}: SectionPageProps) {
  const pageContent: Record<Exclude<Page, 'Inicio'>, { icon: typeof ListTodo; label: string; description: string }> = {
    Tareas: { icon: ListTodo, label: 'Tus tareas', description: `${pendingCount} pendientes para mantener todo en orden.` },
    Calendario: { icon: CalendarDays, label: 'Tu calendario', description: 'Reúne las fechas y actividades importantes del hogar.' },
    Finanzas: { icon: Wallet, label: 'Tus finanzas', description: 'Lleva un registro sencillo de los movimientos de tu hogar.' },
    Notas: { icon: StickyNote, label: 'Tus notas', description: 'Un espacio para guardar ideas, listas y recordatorios.' },
  };
  const content = pageContent[page];
  const Icon = content.icon;

  return (
    <section className="section-page">
      <div className="eyebrow"><span className="eyebrow-dot" /> MI HOGAR</div>
      <h1>{content.label}<span>.</span></h1>
      <p className="welcome-subtitle">{content.description}</p>
      {page === 'Tareas' ? (
        <article className="panel section-panel">
          <div className="panel-heading">
            <div><div className="panel-overline">LISTA PERSONAL</div><h2>Todo lo que tienes en mente</h2></div>
            <span className="date-badge"><CheckCircle2 size={15} /> {pendingCount} pendientes</span>
          </div>
          <TaskList
            tasks={tasks}
            addingTask={addingTask}
            newTask={newTask}
            onAddTask={onAddTask}
            onNewTaskChange={onNewTaskChange}
            onToggleTask={onToggleTask}
            onStartAdding={onStartAdding}
            onCancelAdding={onCancelAdding}
          />
        </article>
      ) : (
        <article className="panel section-empty-panel">
          <span className="section-empty-icon"><Icon size={25} /></span>
          <h2>{page === 'Calendario' ? 'Todavía no hay eventos' : page === 'Finanzas' ? 'Empieza con un registro' : 'Tus ideas tienen un lugar'}</h2>
          <p>{page === 'Calendario'
            ? 'Tu calendario está listo para reunir cumpleaños, citas y actividades del hogar.'
            : page === 'Finanzas'
              ? 'Aquí podrás consultar el resumen de ingresos y gastos de tu hogar.'
              : 'Aquí podrás guardar ideas, listas y recordatorios importantes.'}</p>
        </article>
      )}
    </section>
  );
}

export default App;
