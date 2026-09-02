export const Product = ({ id, name, category, user }) => (
  <tr data-cy="Product">
    <td className="has-text-weight-bold" data-cy="ProductId">
      {id}
    </td>

    <td data-cy="ProductName">{name}</td>
    <td data-cy="ProductCategory">
      {category.icon} - {category.title}
    </td>

    <td
      data-cy="ProductUser"
      className={user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
    >
      {user.name}
    </td>
  </tr>
);
