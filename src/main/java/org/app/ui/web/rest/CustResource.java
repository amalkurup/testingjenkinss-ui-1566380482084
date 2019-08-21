package org.app.ui.web.rest;
import org.app.ui.domain.Cust;
import org.app.ui.service.CustService;
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
 * REST controller for managing Cust.
 */
@RestController
@RequestMapping("/api")
public class CustResource {

    private final Logger log = LoggerFactory.getLogger(CustResource.class);

    private static final String ENTITY_NAME = "cust";

    private final CustService custService;

    public CustResource(CustService custService) {
        this.custService = custService;
    }

    /**
     * POST  /custs : Create a new cust.
     *
     * @param cust the cust to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cust, or with status 400 (Bad Request) if the cust has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/custs")
    public ResponseEntity<Cust> createCust(@RequestBody Cust cust) throws URISyntaxException {
        log.debug("REST request to save Cust : {}", cust);
        if (cust.getId() != null) {
            throw new BadRequestAlertException("A new cust cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cust result = custService.save(cust);
        return ResponseEntity.created(new URI("/api/custs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /custs : Updates an existing cust.
     *
     * @param cust the cust to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cust,
     * or with status 400 (Bad Request) if the cust is not valid,
     * or with status 500 (Internal Server Error) if the cust couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/custs")
    public ResponseEntity<Cust> updateCust(@RequestBody Cust cust) throws URISyntaxException {
        log.debug("REST request to update Cust : {}", cust);
        if (cust.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Cust result = custService.save(cust);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cust.getId().toString()))
            .body(result);
    }

    /**
     * GET  /custs : get all the custs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of custs in body
     */
    @GetMapping("/custs")
    public List<Cust> getAllCusts() {
        log.debug("REST request to get all Custs");
        return custService.findAll();
    }

    /**
     * GET  /custs/:id : get the "id" cust.
     *
     * @param id the id of the cust to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cust, or with status 404 (Not Found)
     */
    @GetMapping("/custs/{id}")
    public ResponseEntity<Cust> getCust(@PathVariable Long id) {
        log.debug("REST request to get Cust : {}", id);
        Optional<Cust> cust = custService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cust);
    }

    /**
     * DELETE  /custs/:id : delete the "id" cust.
     *
     * @param id the id of the cust to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/custs/{id}")
    public ResponseEntity<Void> deleteCust(@PathVariable Long id) {
        log.debug("REST request to delete Cust : {}", id);
        custService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
