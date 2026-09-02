import cn from 'classnames';

export const Category = ({ id, title, selected, handleSelect }) => (
  <a
    data-cy="Category"
    className={cn('button', 'mr-2', 'mr-1', {
      'is-info': selected.includes(id),
    })}
    href="#/"
    onClick={() => handleSelect(id)}
  >
    {title}
  </a>
);
