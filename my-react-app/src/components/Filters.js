function Filters({ filters, setFilters }) {
  return (
    <div className="filters">
      <h2>Фільтри</h2>

      <label>
        Сортування за ціною:
        <select
          value={filters.sortByPrice}
          onChange={(e) =>
            setFilters({ ...filters, sortByPrice: e.target.value })
          }
        >
          <option value="">Без сортування</option>
          <option value="asc">Від дешевих до дорогих</option>
          <option value="desc">Від дорогих до дешевих</option>
        </select>
      </label>

      <label>
        Кількість кімнат:
        <select
          value={filters.rooms}
          onChange={(e) =>
            setFilters({ ...filters, rooms: e.target.value })
          }
        >
          <option value="">Усі</option>
          <option value="1">1 кімната</option>
          <option value="2">2 кімнати</option>
          <option value="3">3 кімнати</option>
          <option value="4">4+ кімнати</option>
        </select>
      </label>

      <label>
        Тип квартири:
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option value="">Усі</option>
          <option value="Квартира">Квартира</option>
          <option value="Студія">Студія</option>
          <option value="Будинок">Будинок</option>
        </select>
      </label>
    </div>
  );
}

export default Filters;