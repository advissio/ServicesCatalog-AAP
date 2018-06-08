import {
  Injectable,
  Inject,
  forwardRef
}                           from '@angular/core';
import { Product }          from '../shared/models';
import { ProductsSandbox }  from './products.sandbox';
import { map }              from 'rxjs/operators';

@Injectable()
export class ProductsService {

  private productsSubscription;

  /**
   * Transforms grid data products recieved from the API into array of 'Product' instances
   *
   * @param products
   */
  static gridAdapter(products: any): Array<Product> {
    return products.pipe(map(product => new Product(product)));
  }

  /**
   * Transforms product details recieved from the API into instance of 'Product'
   *
   * @param product
   */
  static productDetailsAdapter(product: any): Product {
    return new Product(product);
  }
}