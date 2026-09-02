export const PanelUser = ({ name, id, handleSelect, filter }) => (
  <a
    data-cy="FilterUser"
    href="#/"
    onClick={() => handleSelect(id)}
    className={filter === id ? 'is-active' : ''}
  >
    {name}
  </a>
);
