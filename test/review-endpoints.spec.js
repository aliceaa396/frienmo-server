const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('reviews Endpoints', function() {
  let db

  const { testReviews, testUsers, } = helpers.makeReviewsFixtures()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_TEST_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', async () => { 
      await helpers.cleanTables(db)
    })


  describe(`POST /api/review`, () => {
    beforeEach('insert review', () =>
      helpers.seedReviewsTables(
        db,
        testUsers,
        testReviews,
      )
    )

    it(`creates a review, responding with 201 and the new review`, function() {
        const testUser = testUsers
        const newreview = {
            comment: 'Test new review',
            reviewee: testUser[0].id,
            
        }
        return supertest(app)
          .post('/api/review')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newreview)
          .expect(201)
          .expect(res => {
            expect(res.body.comment).to.eql(newreview.comment)
            expect(res.body.reviewee).to.eql(newreview.reviewee)
            expect(res.headers.location).to.eql(`/api/review/${res.body.id}`)
          })
          .expect(res =>
            db
              .from('review')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.comment).to.eql(newreview.comment)
             })
          )
      })

    })
////////////////////////////////////////////////////////////////////
    describe(`GET /api/review/:id`, () => {
        beforeEach('insert Reviews', () =>
        helpers.seedReviewsTables(
          db,
          testUsers,
          testReviews,
        )
      )
        it(`gets a review, responding with 200 and get a review`, function() {
            
            let reviewId = testReviews[0].id
            return supertest(app)
              .get(`/api/review/${reviewId}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(res => { 
                expect(200)
                expect(res.body.id).to.eql(reviewId)
              })
              
              
          })
    
        })

        describe(`GET /api/review/user/:user_id`, () => {
          beforeEach('insert Reviews', () =>
          helpers.seedReviewsTables(
            db,
            testUsers,
            testReviews,
          )
        )  
            
            it(`gets a favor id with correct userid/reviewer id, responding with 200 and gets user`, function() {
                const user_id = testUsers[0].id
                return supertest(app)
                  .get(`/api/review/user/${user_id}`)
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                  .expect(200)
                  .expect(res => {
                   expect(res.body[0].reviewer).to.eql(user_id)
                  })
              })
        
            })


})


