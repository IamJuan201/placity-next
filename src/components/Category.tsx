import type { Category } from "../types/category";

interface CategoryProps {
    category: Category;
    isAdmin: boolean;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export default function CategoryItem({ category, isAdmin, onEdit, onDelete }: CategoryProps) {
    return (
        <div className="category-item">
            <div className="category-info">
                <h3>{category.name}</h3>
                {category.description && <p>{category.description}</p>}
            </div>
            {isAdmin && (
                <div className="category-actions">
                    <button className="btn-edit" onClick={() => onEdit(category)}>Editar</button>
                    <button className="btn-delete" onClick={() => onDelete(category.id)}>Eliminar</button>
                </div>
            )}
        </div>
    )
}