export interface Recipe {
  _ownerId: string;
  recipeName: string;
  recipeType: string;
  preparationTime: number;
  imageURL: string;
  description: string;
  ingredients: string;
  instructions: string;
  _createdOn: number;
  _id: string;
}

export interface NewRecipeData {
  recipeName: string;
  recipeType: string;
  preparationTime: number;
  imageURL: string;
  description: string;
  ingredients: string;
  instructions: string;
}
