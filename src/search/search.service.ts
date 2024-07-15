import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Connection, Model } from 'mongoose';
import { ProductDocument } from 'src/schema/product.schema';
// import * as axios from 'axios';

@Injectable()
export class SearchService {
  index = 'search-test';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectConnection() private connection: Connection,
    @InjectModel('PRODUCTS')
    private product: Model<ProductDocument>,
  ) {}

  //   curl -X POST '<ENTERPRISE_SEARCH_BASE_URL>/api/as/v1/engines/national-parks-demo/documents' \
  // -H 'Content-Type: application/json' \
  // -H 'Authorization: Bearer private-xxxxxxxxxxxxxxxxxxxx' \
  // -d '[
  //   {
  //     "description": "Death Valley is the hottest, lowest, and driest place in the United States. Daytime temperatures have topped 130 °F (54 °C) and it is home to Badwater Basin, the lowest elevation in North America. The park contains canyons, badlands, sand dunes, and mountain ranges, while more than 1000 species of plants grow in this geologic graben. Additional points of interest include salt flats, historic mines, and springs.",
  //     "nps_link": "https://www.nps.gov/deva/index.htm",
  //     "states": [
  //       "California",
  //       "Nevada"
  //     ],
  //     "title": "Death Valley",
  //     "visitors": "1296283",
  //     "world_heritage_site": "false",
  //     "location": "36.24,-116.82",
  //     "acres": "3373063.14",
  //     "square_km": "13650.3",
  //     "date_established": "1994-10-31T06:00:00Z",
  //     "id": "park_death-valley"
  //   }
  // ]'

  //   ENTERPRISE_SEARCH_BASE_URL=https://mm-search.ent.ap-southeast-1.aws.found.io
  //  ENTERPRISE_SEARCH_PRIVATE_KEY='private-upy7s1daza6rnfw8xfxm36pj'
  //  ENTERPRISE_SEARCH_ENGINE=dev-v2-engine

  async appSearchIndexProduct(products) {
    // return product;
    // for (const product of products) {
    // console.log(product);
    await this.appSearcBulkRemoveProductFromIndex(products.map((p) => p.id));

    try {
      const ENTERPRISE_SEARCH_BASE_URL = process.env.ENTERPRISE_SEARCH_BASE_URL;
      const PRIVATE_KEY = process.env.ENTERPRISE_SEARCH_PRIVATE_KEY;

      const result = await axios.post(
        `${ENTERPRISE_SEARCH_BASE_URL}/api/as/v1/engines/${process.env.ENTERPRISE_SEARCH_ENGINE}/documents`,
        products,
        {
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Indexed data length: ', result.data.length);
      console.log(result.data);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async appSearcBulkRemoveProductFromIndex(ids) {
    try {
      const ENTERPRISE_SEARCH_BASE_URL = process.env.ENTERPRISE_SEARCH_BASE_URL;
      const PRIVATE_KEY = process.env.ENTERPRISE_SEARCH_PRIVATE_KEY;

      const result = await axios.delete(
        `${ENTERPRISE_SEARCH_BASE_URL}/api/as/v1/engines/${process.env.ENTERPRISE_SEARCH_ENGINE}/documents`,
        {
          data: [ids],
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async appSearchRemoveProductFromIndex(id) {
    try {
      const ENTERPRISE_SEARCH_BASE_URL = process.env.ENTERPRISE_SEARCH_BASE_URL;
      const PRIVATE_KEY = process.env.ENTERPRISE_SEARCH_PRIVATE_KEY;

      const result = await axios.delete(
        `${ENTERPRISE_SEARCH_BASE_URL}/api/as/v1/engines/${process.env.ENTERPRISE_SEARCH_ENGINE}/documents`,
        {
          data: [id],
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async indexProducts(product) {
    for (let i = 0; i < product.length; i++) {
      await this.removeProductFromIndex(product[i].id);
      await this.appSearchIndexProduct(product);
    }

    return;
  }

  async indexProduct(product) {
    await this.appSearchIndexProduct(product);
  }

  async search(
    text: string,
    categories: string,
    brands: string,
    shops: string,
  ) {
    const filters = {
      query: text,

      result_fields: {
        productId: { raw: {} },
        name: { raw: {} },
        'seo.keyword': { raw: {} },
      },
      page: {
        size: 2,
        current: 1,
      },
    };

    if (text) {
      filters['search_fields'] = {
        name: { weight: 9 },
        'seo.keyword': {},
      };
    }

    console.log(categories);
    if (categories) {
      filters['filters'] = {
        'breadcumb.slug': categories.split(','),
      };
    }

    try {
      const ENTERPRISE_SEARCH_BASE_URL = `https://mm-search.ent.ap-southeast-1.aws.found.io`;
      const PRIVATE_KEY = 'search-ronawwwe14w1oyyf6v995n8d';

      const result = await axios.post(
        `${ENTERPRISE_SEARCH_BASE_URL}/api/as/v1/engines/dev-test-search-engine/search`,
        filters,
        {
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return result.data;
    } catch (e) {
      console.log(e);
      return e;
    }

    // return result.body;
    // const hits = result.body.hits.hits;

    // return hits.map((item) => item._source);
  }

  async createProductIndex(limit = 100, skip = 0) {
    const dataLimit = 100;
    for (let i = 1; i <= Math.ceil(limit / 100); i++) {
      const products = await this.product.find({}).skip(skip).limit(dataLimit);
      skip = skip + 100;

      const data = products.map((product) => {
        return {
          id: product.id,
          product_id: product.id,
          name: product.name,
          bn_name: product.bn_name,
          slug: product.slug,
          monarchmart_sku: product['monarchmart_sku'],

          shop_id: product.shop_id,
          shop_name:
            product.shop && product.shop['name'] ? product.shop['name'] : '',

          unit_price: product.unit_price,
          discount_price: product.discount_price,
          item_sold: product.item_sold,
          free_delivery: product.free_delivery,
          cash_on_delivery: product.cash_on_delivery,
          wholesale: product.wholesale,
          digital: product.digital,
          emi: product.emi,
          product_type: product.product_type,
          express_delivery: product.express_delivery,
          outside_dhaka: product.outside_dhaka,
          rating: product.rating,
          visible: product.visible ? product.visible : 'all',

          brand_id:
            product.brand && product.brand['id'] ? product.brand['id'] : '',
          brand_name:
            product.brand && product.brand['name'] ? product.brand['name'] : '',
          brand_slug:
            product.brand && product.brand['slug'] ? product.brand['slug'] : '',

          short_description:
            product.detail && product.detail['short_description']
              ? product.detail['short_description']
              : '',
          // long_description:
          //   product.detail && product.detail['long_description']
          //     ? product.detail['long_description']
          //     : '',
          bn_short_description:
            product.detail && product.detail['bn_short_description']
              ? product.detail['bn_short_description']
              : '',
          // bn_long_description:
          //   product.detail && product.detail['bn_long_description']
          //     ? product.detail['bn_long_description']
          //     : '',

          seo_title:
            product.seo && product.seo['title'] ? product.seo['title'] : '',
          seo_keyword:
            product.seo && product.seo['keyword'] ? product.seo['keyword'] : '',
          seo_description:
            product.seo && product.seo['description']
              ? product.seo['description']
              : '',

          specifications_names: product.specifications.map(
            (item) => item.attribute_name,
          ),
          specifications_values: product.specifications.map(
            (item) => item.value,
          ),

          sku_monarchmart_skus: product.skus.map(
            (item) => item.monarchmart_sku,
          ),
          sku_skus: product.skus.map((item) => item.sku),

          categories_ids: product.breadcumb.map((item) => item.id),
          categories_slugs: product.breadcumb.map((item) => item.slug),
          categories_names: product.breadcumb.map((item) => item.name),

          created_at: product.created_at,
          updated_at: product.updated_at,
        };
      });

      if (data.length) {
        await this.appSearchIndexProduct(data);
      }

      console.log('original data length: ', data.length);
    }

    return skip;
  }

  async removeProductFromIndex(product_id) {
    await this.appSearchRemoveProductFromIndex(product_id);
  }

  async removeProductsFromIndex(product) {
    for (let i = 0; i < product.length; i++) {
      await this.appSearchRemoveProductFromIndex(product[i].id);
    }
  }

  async searchForPosts(text: string) {
    // const results = await this.search(text);
    // return results;
  }

  async indexCategory(category) {
    await this.elasticsearchService.index({
      index: this.index,
      refresh: true,
      body: {
        image: category.icon,
        name: category.name,
        id: null,
        brand_id: null,
        category_id: category.id,
        shop_id: null,
        datatype: 'category',
        slug: category.slug,
      },
    });
  }

  async indexBrand(brand) {
    await this.elasticsearchService.index({
      index: this.index,
      refresh: true,
      body: {
        image: brand.logo,
        name: brand.name,
        id: null,
        brand_id: brand.id,
        category_id: null,
        shop_id: null,
        datatype: 'brand',
        slug: brand.slug,
      },
    });
  }

  async indexCategories() {
    const response = await axios({
      method: 'get',
      url: `${process.env.CATALOG_URL}/category`,
    }).then((response) => response.data);

    if (response.length) {
      console.log('hit');
      for (let i = 1; i < response.length; i++) {
        await this.indexCategory(response[i]);
      }

      return response;
    }
  }

  async indexBrands() {
    const response = await axios({
      method: 'get',
      url: `${process.env.CATALOG_URL}/brand`,
    }).then((response) => response.data);

    // return response;
    if (response.length) {
      console.log('hit');
      for (let i = 1; i < response.length; i++) {
        await this.indexBrand(response[i]);
      }

      return response;
    }
  }

  async indexShops() {
    const response = await axios({
      method: 'get',
      url: `${process.env.SHOPMANAGER_URL}/shop/get-all-public-shops`,
    }).then((response) => response.data);

    if (response.length) {
      console.log('hit');
      for (let i = 1; i < response.length; i++) {
        await this.indexShop(response[i]);
      }

      return response;
    }
  }

  async indexShop(shop) {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            shop_id: shop.id,
          },
        },
      },
    });

    await this.elasticsearchService.index({
      index: this.index,
      refresh: true,
      body: {
        image: shop.avatar,
        name: shop.name,
        id: null,
        brand_id: null,
        category_id: null,
        shop_id: shop.id,
        datatype: 'shop',
        slug: shop.slug,
      },
    });
  }
}
