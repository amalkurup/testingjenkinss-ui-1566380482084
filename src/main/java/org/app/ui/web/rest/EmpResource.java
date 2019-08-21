package org.app.ui.web.rest;
import org.app.ui.domain.Emp;
import org.app.ui.service.EmpService;
import org.app.ui.web.rest.errors.BadRequestAlertException;
import org.app.ui.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Emp.
 */
@RestController
@RequestMapping("/api")
public class EmpResource {

    private final Logger log = LoggerFactory.getLogger(EmpResource.class);

    private static final String ENTITY_NAME = "emp";

    private final EmpService empService;

    public EmpResource(EmpService empService) {
        this.empService = empService;
    }

    /**
     * POST  /emps : Create a new emp.
     *
     * @param emp the emp to create
     * @return the ResponseEntity with status 201 (Created) and with body the new emp, or with status 400 (Bad Request) if the emp has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/emps")
    public ResponseEntity<Emp> createEmp(@RequestBody Emp emp) throws URISyntaxException {
        log.debug("REST request to save Emp : {}", emp);
        if (emp.getId() != null) {
            throw new BadRequestAlertException("A new emp cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Emp result = empService.save(emp);
        return ResponseEntity.created(new URI("/api/emps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /emps : Updates an existing emp.
     *
     * @param emp the emp to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated emp,
     * or with status 400 (Bad Request) if the emp is not valid,
     * or with status 500 (Internal Server Error) if the emp couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/emps")
    public ResponseEntity<Emp> updateEmp(@RequestBody Emp emp) throws URISyntaxException {
        log.debug("REST request to update Emp : {}", emp);
        if (emp.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Emp result = empService.save(emp);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, emp.getId().toString()))
            .body(result);
    }

    /**
     * GET  /emps : get all the emps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of emps in body
     */
    @GetMapping("/emps")
    public List<Emp> getAllEmps() {
        log.debug("REST request to get all Emps");
        return empService.findAll();
    }

    /**
     * GET  /emps/:id : get the "id" emp.
     *
     * @param id the id of the emp to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the emp, or with status 404 (Not Found)
     */
    @GetMapping("/emps/{id}")
    public ResponseEntity<Emp> getEmp(@PathVariable Long id) {
        log.debug("REST request to get Emp : {}", id);
        Optional<Emp> emp = empService.findOne(id);
        return ResponseUtil.wrapOrNotFound(emp);
    }

    /**
     * DELETE  /emps/:id : delete the "id" emp.
     *
     * @param id the id of the emp to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/emps/{id}")
    public ResponseEntity<Void> deleteEmp(@PathVariable Long id) {
        log.debug("REST request to delete Emp : {}", id);
        empService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
