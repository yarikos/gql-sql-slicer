const { gqlToDb, gqlBuild } = require("./gql-sql-slicer");


xdescribe('builder for mulyquery requests', () => {
  test('mixing the object', () => {
    const table = [[
      {
        device: 'mobile',
        no_baskets: '1070'
      },
      {
        device: 'desktop',
        no_baskets: '2010'
      },
    ], [
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '101'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '107'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '201'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '207'
      }
    ]]
    const querier = gqlToDb().dbFetch(({ definitions }) => {
      return table;
    })

    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          no_baskets: sum(a: no_baskets)
          date(type: Array){
            no_baskets: sum(a: no_baskets)
          }
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())


  })
  test('two queries to object', () => {
    const table = [[
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '101'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '107'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '201'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '207'
      }
    ], [
      {
        device: 'mobile',
        no_baskets: '1070'
      },
      {
        device: 'desktop',
        no_baskets: '2010'
      },
    ]]


    const querier = gqlToDb().dbFetch(({ definitions }) => {
      return table;
    })

    return querier(`query table{
      byDate: fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array){
            no_baskets: sum(a:no_baskets)
          }
        }
      }
    }
    {
      byDevice: fetch(brand: Amd, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          no_baskets: sum(a:no_baskets)
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())


  })

  test('basic example works', () => {

    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    return querier(`query table{
      query1: fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array) {
            no_baskets: sum(a:no_baskets)
            no_all_baskets: sum(a:no_all_baskets)
            no_unique_products: sum(a:no_unique_products)
          }
          ano_no_baskets: sum(a:ano_no_baskets)
          ano_no_all_baskets: sum(a:ano_no_all_baskets)
          ano_no_unique_products: sum(a:ano_no_unique_products) 
        }
      }
      
    }
 
    `);
  })
  test('two queries', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
    query1: fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
      device {
        date(type: Array) {
          no_baskets: sum(a:no_baskets)
          no_all_baskets: sum(a:no_all_baskets)
          no_unique_products: sum(a:no_unique_products)
        }
        ano_no_baskets: sum(a:ano_no_baskets)
        ano_no_all_baskets: sum(a:ano_no_all_baskets)
        ano_no_unique_products: sum(a:ano_no_unique_products) 
      }
    }
    
  }
  query table{
    fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
      device {
        date(type: Array) {
          no_brand_products: sum(a:no_brand_products)
          no_uniqie_brand_products: sum(a:no_uniqie_brand_products)
          total_revenue: sum(a:total_revenue)
          brand_revenue: sum(a:brand_revenue)
        }
      }
    }
  }
  `)
  })
  test('basic example works', () => {

    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          avg: divide(a:no_of_baskets, by:no_all_baskets) 
          date(type: Array) {
            avg: divide(a:no_of_baskets, by:no_all_baskets) 
          }
        }
      }
      
    }
 
    `);
  })

  test('basic example works', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        custom_name: device
      }
    }
    `);
  })
})



xdescribe('gqlBuilder single query', () => {
  test('distinct', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch{
        device: distinct
      }
    }
    `);
  })


  test('basic example works', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array) {
            no_baskets: sum(a:no_baskets)
            no_all_baskets: sum(a:no_all_baskets)
            no_unique_products: sum(a:no_unique_products)
            no_brand_products: sum(a:no_brand_products)
            no_uniqie_brand_products: sum(a:no_uniqie_brand_products) 
            total_revenue: sum(a:total_revenue)
            brand_revenue: sum(a:brand_revenue)
          }
        }
      }
    }
    `);
  })

  test('basic Array with sorting works', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(category: whatever, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        channel(type: Array, sort_desc: session_value) {
            session_value: divide(a:revenue, by:sessions)
        }
      }
    }
    `);
  })
  test('metric functions', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array) {
            no_unique_products: sum(a:no_unique_products)
            no_brand_products: sum(a:no_brand_products)
            average: divide(a:no_baskets, by:no_all_baskets)
          }
        }
      }
    }
    `);
  })

  test('dimension functions', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array){
            position: aggrAverage(to:no_baskets, by:no_all_baskets) 
          }
        }
      }
    }
    `);
  })
  test('group date by month', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array, groupBy:month){
            no_unique_products: sum(a:no_unique_products)
            no_brand_products: sum(a:no_brand_products)
          }
        }
      }
    }
    `);
  })
})


xdescribe('merge', () => {

  test('basic example works', () => {
    const tables = [[
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '100',
        no_all_baskets: '101',
        no_unique_products: '102',
        no_brand_products: '103',
        no_uniqie_brand_products: '104',
        total_revenue: '105',
        brand_revenue: '106'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '109',
        no_all_baskets: '107',
        no_unique_products: '108',
        no_brand_products: '110',
        no_uniqie_brand_products: '111',
        total_revenue: '112',
        brand_revenue: '113'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        no_baskets: '200',
        no_all_baskets: '201',
        no_unique_products: '202',
        no_brand_products: '203',
        no_uniqie_brand_products: '204',
        total_revenue: '205',
        brand_revenue: '206'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        no_baskets: '209',
        no_all_baskets: '207',
        no_unique_products: '208',
        no_brand_products: '210',
        no_uniqie_brand_products: '211',
        total_revenue: '212',
        brand_revenue: '213'
      }
    ]]

    const querier = gqlToDb().dbFetch(() => {
      return tables
    })


    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array) {
            no_baskets
            no_all_baskets
            no_unique_products 
            no_brand_products
            no_uniqie_brand_products 
            total_revenue
            brand_revenue
          }
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())
  })


  test('metric functions', () => {
    const table = [[
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        no_unique_products: '100',
        no_brand_products: '101',
        average: '102'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        no_unique_products: '109',
        no_brand_products: '107',
        average: '108'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        no_unique_products: '200',
        no_brand_products: '201',
        average: '202'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        no_unique_products: '209',
        no_brand_products: '207',
        average: '208'
      }
    ]]
    const querier = gqlToDb().dbFetch(() => {
      return table
    })

    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array) {
            no_unique_products 
            no_brand_products
            average: divide(a:no_baskets, by:no_all_baskets)
          }
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot());

  })

  test('dimension functions', () => {
    const table = [[
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        position_aggrAverage: '100',
        no_baskets: '101',
        no_all_baskets: '102'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        position_aggrAverage: '109',
        no_baskets: '107',
        no_all_baskets: '108'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        position_aggrAverage: '200',
        no_baskets: '201',
        no_all_baskets: '202'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        position_aggrAverage: '209',
        no_baskets: '207',
        no_all_baskets: '208'
      }
    ]]
    const querier = gqlToDb().dbFetch(() => {
      return table
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array){
            position: aggrAverage(to:no_baskets, by:no_all_baskets) 
          }
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())

  })
  xtest('date formatting', () => {
    const table = [
      {
        device: 'mobile',
        date: '2020-01-01T23:00:00.000Z',
        position_aggrAverage: '100',
        no_baskets: '101',
        no_all_baskets: '102'
      },
      {
        device: 'mobile',
        date: '2020-01-02T23:00:00.000Z',
        position_aggrAverage: '109',
        no_baskets: '107',
        no_all_baskets: '108'
      },
      {
        device: 'desktop',
        date: '2020-01-01T23:00:00.000Z',
        position_aggrAverage: '200',
        no_baskets: '201',
        no_all_baskets: '202'
      },
      {
        device: 'desktop',
        date: '2020-01-02T23:00:00.000Z',
        position_aggrAverage: '209',
        no_baskets: '207',
        no_all_baskets: '208'
      }
    ]
    const querier = gqlToDb().dbFetch(() => {
      return table
    })
    return querier(`query table{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        device {
          date(type: Array, format: "Mon yy"){
            position: aggrAverage(to:no_baskets, by:no_all_baskets) {
              no_baskets 
              no_all_baskets
            }
          }
        }
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())

  })

  test('array on top position', () => {
    const table = [[
      {
        "country": "FR"
      },
      {
        "country": "MX"
      },
      {
        "country": "PL"
      },
      {
        "country": "ES"
      },
      {
        "country": "PT"
      },
      {
        "country": "US"
      },
      {
        "country": "FR"
      },
      {
        "country": "IT"
      },
      {
        "country": "GB"
      },
      {
        "country": "DE"
      }
    ]]
    const querier = gqlToDb().dbFetch(() => {
      return table
    })
    return querier(`query table{
      fetch{
        country: distinct(type: Array)
      }
    }
    `).then((result) => expect(result).toMatchSnapshot())

  })

})

xdescribe('gqlBuilder single query', () => {
  test('handle table name in query', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    return querier(`query some_table_name{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        custom_name {
          device
        }
      }
    }
    query some_other_table_name{
      fetch(brand: Adidas, country: US, date_gt: "2020-1-1", date_lt: "2021-7-12") {
        custom_name_second {
          device_second
        }
      }
    }
    `);
  })
})

describe('gqlBuilder function', () => {
  test('share', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    querier(`query ecom_benchmarking {
      fetch(date: "2020-11-27", category: "Finance/Investing") {
          channels {
              share: share(a:sessions)
          }
      }
    }`);
  })
})

describe('gqlBuilder joins and complex queries', () => {
  test('simple use of the result of different query', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    querier(`query TEMP_BRAND_BASKET_POSITION_TABLE{
      position1: fetch(brand: adidas, country: us, position: 1) {
        position1_baskets: sum(a: no_of_baskets)
      }
      fetch(brand: adidas, country: us){
        ... with
        position1 {
          result: divide(a:no_of_baskets, by:"max|position1.position1_baskets")
        }
      }
    }
    `);
  })
  test('simple use of the result of different query', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    querier(`
    query OTHER_TABLE{
      position1: fetch(brand: adidas, country: us, position: 1) {
        position1_baskets: sum(a: no_of_baskets)
      }
    }
    query TEMP_BRAND_BASKET_POSITION_TABLE{
      fetch(brand: adidas, country: us){
        ... with
        position1 {
          result: divide(a:no_of_baskets, by:"max|position1.position1_baskets")
        }
      }
    }
    `);
  })
  xtest('simple use of the result of different query', () => {
    const querier = gqlToDb().beforeDbFetch(({ sql }) => {
      expect(sql).toMatchSnapshot();
    })

    querier(`
    query OTHER_TABLE{
      position1: fetch(brand: adidas, country: us, position: 1) {
        position1_baskets: sum(a: no_of_baskets)
      }
    }
    query TEMP_BRAND_BASKET_POSITION_TABLE{
      fetch(brand: adidas, country: us){
        ... join
        position1(a:country ,b:"position1.country") {
          result: divide(a:no_of_baskets, by:"position1.position1_baskets")
        }
      }
    }
    `);
  })
})
// test('simple use of the result of different query', () => {
//   const querier = gqlToDb().beforeDbFetch(({ sql }) => {
//     console.log(sql)
//     // expect(sql).toMatchSnapshot();
//   })

//   querier(`
//   query temp_brand_basket_position_table {
//     byDevice: fetch(brand: adidas, country: us) {
//             date (type: Array, groupBy: week) {
//                     device {
//                         value: weightAvg(a:position, by:no_of_baskets)
//                     }
//             }
//     }
//     all: fetch(brand: adidas, country: us) {
//         date (type: Array, groupBy: week) {
//                 value: weightAvg(a:position, by:no_of_baskets)
//         }
// }
// }
//   `);
// })
