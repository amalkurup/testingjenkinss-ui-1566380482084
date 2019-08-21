package org.app.ui.web.rest;

import org.app.ui.UiapplicationApp;

import org.app.ui.domain.Cust;
import org.app.ui.repository.CustRepository;
import org.app.ui.service.CustService;
import org.app.ui.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static org.app.ui.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CustResource REST controller.
 *
 * @see CustResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = UiapplicationApp.class)
public class CustResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDR = "AAAAAAAAAA";
    private static final String UPDATED_ADDR = "BBBBBBBBBB";

    private static final Integer DEFAULT_CONTACT_NUMBER = 1;
    private static final Integer UPDATED_CONTACT_NUMBER = 2;

    @Autowired
    private CustRepository custRepository;

    @Autowired
    private CustService custService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCustMockMvc;

    private Cust cust;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CustResource custResource = new CustResource(custService);
        this.restCustMockMvc = MockMvcBuilders.standaloneSetup(custResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cust createEntity(EntityManager em) {
        Cust cust = new Cust()
            .name(DEFAULT_NAME)
            .addr(DEFAULT_ADDR)
            .contactNumber(DEFAULT_CONTACT_NUMBER);
        return cust;
    }

    @Before
    public void initTest() {
        cust = createEntity(em);
    }

    @Test
    @Transactional
    public void createCust() throws Exception {
        int databaseSizeBeforeCreate = custRepository.findAll().size();

        // Create the Cust
        restCustMockMvc.perform(post("/api/custs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cust)))
            .andExpect(status().isCreated());

        // Validate the Cust in the database
        List<Cust> custList = custRepository.findAll();
        assertThat(custList).hasSize(databaseSizeBeforeCreate + 1);
        Cust testCust = custList.get(custList.size() - 1);
        assertThat(testCust.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCust.getAddr()).isEqualTo(DEFAULT_ADDR);
        assertThat(testCust.getContactNumber()).isEqualTo(DEFAULT_CONTACT_NUMBER);
    }

    @Test
    @Transactional
    public void createCustWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = custRepository.findAll().size();

        // Create the Cust with an existing ID
        cust.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCustMockMvc.perform(post("/api/custs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cust)))
            .andExpect(status().isBadRequest());

        // Validate the Cust in the database
        List<Cust> custList = custRepository.findAll();
        assertThat(custList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCusts() throws Exception {
        // Initialize the database
        custRepository.saveAndFlush(cust);

        // Get all the custList
        restCustMockMvc.perform(get("/api/custs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cust.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].addr").value(hasItem(DEFAULT_ADDR.toString())))
            .andExpect(jsonPath("$.[*].contactNumber").value(hasItem(DEFAULT_CONTACT_NUMBER)));
    }
    
    @Test
    @Transactional
    public void getCust() throws Exception {
        // Initialize the database
        custRepository.saveAndFlush(cust);

        // Get the cust
        restCustMockMvc.perform(get("/api/custs/{id}", cust.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cust.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.addr").value(DEFAULT_ADDR.toString()))
            .andExpect(jsonPath("$.contactNumber").value(DEFAULT_CONTACT_NUMBER));
    }

    @Test
    @Transactional
    public void getNonExistingCust() throws Exception {
        // Get the cust
        restCustMockMvc.perform(get("/api/custs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCust() throws Exception {
        // Initialize the database
        custService.save(cust);

        int databaseSizeBeforeUpdate = custRepository.findAll().size();

        // Update the cust
        Cust updatedCust = custRepository.findById(cust.getId()).get();
        // Disconnect from session so that the updates on updatedCust are not directly saved in db
        em.detach(updatedCust);
        updatedCust
            .name(UPDATED_NAME)
            .addr(UPDATED_ADDR)
            .contactNumber(UPDATED_CONTACT_NUMBER);

        restCustMockMvc.perform(put("/api/custs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCust)))
            .andExpect(status().isOk());

        // Validate the Cust in the database
        List<Cust> custList = custRepository.findAll();
        assertThat(custList).hasSize(databaseSizeBeforeUpdate);
        Cust testCust = custList.get(custList.size() - 1);
        assertThat(testCust.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCust.getAddr()).isEqualTo(UPDATED_ADDR);
        assertThat(testCust.getContactNumber()).isEqualTo(UPDATED_CONTACT_NUMBER);
    }

    @Test
    @Transactional
    public void updateNonExistingCust() throws Exception {
        int databaseSizeBeforeUpdate = custRepository.findAll().size();

        // Create the Cust

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustMockMvc.perform(put("/api/custs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cust)))
            .andExpect(status().isBadRequest());

        // Validate the Cust in the database
        List<Cust> custList = custRepository.findAll();
        assertThat(custList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCust() throws Exception {
        // Initialize the database
        custService.save(cust);

        int databaseSizeBeforeDelete = custRepository.findAll().size();

        // Delete the cust
        restCustMockMvc.perform(delete("/api/custs/{id}", cust.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Cust> custList = custRepository.findAll();
        assertThat(custList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cust.class);
        Cust cust1 = new Cust();
        cust1.setId(1L);
        Cust cust2 = new Cust();
        cust2.setId(cust1.getId());
        assertThat(cust1).isEqualTo(cust2);
        cust2.setId(2L);
        assertThat(cust1).isNotEqualTo(cust2);
        cust1.setId(null);
        assertThat(cust1).isNotEqualTo(cust2);
    }
}
