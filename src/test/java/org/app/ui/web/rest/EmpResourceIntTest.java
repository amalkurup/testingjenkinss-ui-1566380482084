package org.app.ui.web.rest;

import org.app.ui.UiapplicationApp;

import org.app.ui.domain.Emp;
import org.app.ui.repository.EmpRepository;
import org.app.ui.service.EmpService;
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
 * Test class for the EmpResource REST controller.
 *
 * @see EmpResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = UiapplicationApp.class)
public class EmpResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDR = "AAAAAAAAAA";
    private static final String UPDATED_ADDR = "BBBBBBBBBB";

    private static final Integer DEFAULT_CONTACT_NUMBER = 1;
    private static final Integer UPDATED_CONTACT_NUMBER = 2;

    @Autowired
    private EmpRepository empRepository;

    @Autowired
    private EmpService empService;

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

    private MockMvc restEmpMockMvc;

    private Emp emp;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EmpResource empResource = new EmpResource(empService);
        this.restEmpMockMvc = MockMvcBuilders.standaloneSetup(empResource)
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
    public static Emp createEntity(EntityManager em) {
        Emp emp = new Emp()
            .name(DEFAULT_NAME)
            .addr(DEFAULT_ADDR)
            .contactNumber(DEFAULT_CONTACT_NUMBER);
        return emp;
    }

    @Before
    public void initTest() {
        emp = createEntity(em);
    }

    @Test
    @Transactional
    public void createEmp() throws Exception {
        int databaseSizeBeforeCreate = empRepository.findAll().size();

        // Create the Emp
        restEmpMockMvc.perform(post("/api/emps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emp)))
            .andExpect(status().isCreated());

        // Validate the Emp in the database
        List<Emp> empList = empRepository.findAll();
        assertThat(empList).hasSize(databaseSizeBeforeCreate + 1);
        Emp testEmp = empList.get(empList.size() - 1);
        assertThat(testEmp.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEmp.getAddr()).isEqualTo(DEFAULT_ADDR);
        assertThat(testEmp.getContactNumber()).isEqualTo(DEFAULT_CONTACT_NUMBER);
    }

    @Test
    @Transactional
    public void createEmpWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = empRepository.findAll().size();

        // Create the Emp with an existing ID
        emp.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmpMockMvc.perform(post("/api/emps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emp)))
            .andExpect(status().isBadRequest());

        // Validate the Emp in the database
        List<Emp> empList = empRepository.findAll();
        assertThat(empList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllEmps() throws Exception {
        // Initialize the database
        empRepository.saveAndFlush(emp);

        // Get all the empList
        restEmpMockMvc.perform(get("/api/emps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emp.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].addr").value(hasItem(DEFAULT_ADDR.toString())))
            .andExpect(jsonPath("$.[*].contactNumber").value(hasItem(DEFAULT_CONTACT_NUMBER)));
    }
    
    @Test
    @Transactional
    public void getEmp() throws Exception {
        // Initialize the database
        empRepository.saveAndFlush(emp);

        // Get the emp
        restEmpMockMvc.perform(get("/api/emps/{id}", emp.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(emp.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.addr").value(DEFAULT_ADDR.toString()))
            .andExpect(jsonPath("$.contactNumber").value(DEFAULT_CONTACT_NUMBER));
    }

    @Test
    @Transactional
    public void getNonExistingEmp() throws Exception {
        // Get the emp
        restEmpMockMvc.perform(get("/api/emps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEmp() throws Exception {
        // Initialize the database
        empService.save(emp);

        int databaseSizeBeforeUpdate = empRepository.findAll().size();

        // Update the emp
        Emp updatedEmp = empRepository.findById(emp.getId()).get();
        // Disconnect from session so that the updates on updatedEmp are not directly saved in db
        em.detach(updatedEmp);
        updatedEmp
            .name(UPDATED_NAME)
            .addr(UPDATED_ADDR)
            .contactNumber(UPDATED_CONTACT_NUMBER);

        restEmpMockMvc.perform(put("/api/emps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEmp)))
            .andExpect(status().isOk());

        // Validate the Emp in the database
        List<Emp> empList = empRepository.findAll();
        assertThat(empList).hasSize(databaseSizeBeforeUpdate);
        Emp testEmp = empList.get(empList.size() - 1);
        assertThat(testEmp.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmp.getAddr()).isEqualTo(UPDATED_ADDR);
        assertThat(testEmp.getContactNumber()).isEqualTo(UPDATED_CONTACT_NUMBER);
    }

    @Test
    @Transactional
    public void updateNonExistingEmp() throws Exception {
        int databaseSizeBeforeUpdate = empRepository.findAll().size();

        // Create the Emp

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmpMockMvc.perform(put("/api/emps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(emp)))
            .andExpect(status().isBadRequest());

        // Validate the Emp in the database
        List<Emp> empList = empRepository.findAll();
        assertThat(empList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEmp() throws Exception {
        // Initialize the database
        empService.save(emp);

        int databaseSizeBeforeDelete = empRepository.findAll().size();

        // Delete the emp
        restEmpMockMvc.perform(delete("/api/emps/{id}", emp.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Emp> empList = empRepository.findAll();
        assertThat(empList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Emp.class);
        Emp emp1 = new Emp();
        emp1.setId(1L);
        Emp emp2 = new Emp();
        emp2.setId(emp1.getId());
        assertThat(emp1).isEqualTo(emp2);
        emp2.setId(2L);
        assertThat(emp1).isNotEqualTo(emp2);
        emp1.setId(null);
        assertThat(emp1).isNotEqualTo(emp2);
    }
}
