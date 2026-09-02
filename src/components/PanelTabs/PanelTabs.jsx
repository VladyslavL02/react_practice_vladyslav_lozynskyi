import { PanelUser } from '../PanelUser/PanelUser';

export const PanelTabs = ({ users, handleSelect, filter }) => (
  <p className="panel-tabs has-text-weight-bold">
    <a
      data-cy="FilterAllUsers"
      href="#/"
      onClick={() => handleSelect('')}
      className={filter === '' ? 'is-active' : ''}
    >
      All
    </a>

    {users.map(({ id, name }) => (
      <PanelUser
        key={id}
        name={name}
        id={id}
        handleSelect={handleSelect}
        filter={filter}
      />
    ))}
  </p>
);
