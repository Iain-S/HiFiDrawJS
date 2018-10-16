from selenium import webdriver
from selenium.common.exceptions import WebDriverException
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
import unittest
import time
from selenium.webdriver.common.keys import Keys

# NOTE: You may need to download geckodriver, if you are using linux and haven't already downloaded it


def wait_ten_seconds_for(some_function):
    def decorated_function(the_self, arg_one):
        max_wait = 10
        start_time = time.time()
        # print("Timer started")
        while True:
            try:
                return some_function(the_self, arg_one)
            except (AssertionError, WebDriverException) as e:
                if time.time() - start_time > max_wait:
                    # print("waiting for up to ten seconds")
                    raise e
                time.sleep(0.5)

    return decorated_function


class TestNewVisitor(unittest.TestCase):
    port = '8009'

    def setUp(self):
        options = Options()
        options.add_argument("--headless")
        self.browser = webdriver.Firefox(options=options)
        try:
            self.browser.get('http://localhost:{}/'.format(self.port))
        except WebDriverException:
            print("Exception in setUp().  Have you remembered to start a webserver on port {}?".format(self.port))
            self.browser.quit()
            raise

    def tearDown(self):
        self.browser.quit()

    @wait_ten_seconds_for
    def check_for_href_and_download_in_element(self, element_id):
        download_button = self.browser.find_element_by_id(element_id)
        download_link = download_button.get_attribute('href')
        self.assertIsNotNone(download_link)

        download_filename = download_button.get_attribute('download')
        self.assertEqual(download_filename, 'HiFiDraw.png')

    @wait_ten_seconds_for
    def check_for_page_title(self, expected_title):
        self.assertEqual(self.browser.title, expected_title)

    def test_can_make_super_simple_diagram(self):
        # Edith wants to make a super simple diagram to of her iPhone and active monitors.
        # Someone gives her a link to our site

        # She notices the page title and header
        self.assertIn('HiFiDraw', self.browser.title)

        page_header = self.browser.find_element_by_tag_name('h3').text
        self.assertIn('HiFi Draw', page_header)

        # She notices a table row, which seems to want some source input
        table_cells = self.browser.find_elements_by_tag_name("input")
        src_input_box = table_cells[8]
        dst_input_box = table_cells[9]

        self.assertEqual(
            src_input_box.get_attribute('placeholder'),
            'source'
        )

        # She notices a table row, which seems to want some destination input
        self.assertEqual(
            dst_input_box.get_attribute('placeholder'),
            'dest'
        )

    def test_keyboard_shortcuts(self):
        # There should be a total of four in the table;
        # one header, two rows of pre-populated data and an empty row
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 4, "Expected four rows to begin with.")

        # She notices a table row, which seems to want some source input
        table_cells = self.browser.find_elements_by_tag_name("input")
        src_input_box = table_cells[4]
        dst_input_box = table_cells[5]

        src_input_box.send_keys("Edith's iPhone")
        dst_input_box.send_keys("Mackie CR3s")
        dst_input_box.send_keys(Keys.RETURN)
        time.sleep(0.5)

        # There should be a total of five in the table;
        # one header, two rows of pre-populated data and the new one
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 5, "Expected four rows after ENTER keystroke.")

    def test_can_delete_rows(self):
        # We begin with some rows
        start_rows = self.browser.find_elements_by_tag_name('tr')
        num_rows_start = len(start_rows)
        self.assertEqual(num_rows_start, 4, "Expected four rows to begin with.")

        # Try to delete a row
        self.browser.find_element_by_xpath("//input[@value='-']").click()

        end_rows = self.browser.find_elements_by_tag_name('tr')
        num_rows_end = len(end_rows)

        self.assertEqual(num_rows_start-1, num_rows_end)

    def test_can_download_png(self):
        self.check_for_href_and_download_in_element('id_download')

    def test_there_is_export_link(self):
        export_link = self.browser.find_element_by_id('id_export_link')
        current_url = self.browser.current_url
        self.assertTrue(current_url in export_link.text)

    def test_can_follow_examples_link(self):
        example_link_element = self.browser.find_element_by_id('id_examples_link')

        # User .get_attribute instead of .text because the element may be hidden in the nav bar collapsible
        example_link_text = example_link_element.get_attribute('textContent')
        self.assertEqual(example_link_text, 'Examples')

        example_link = example_link_element.get_attribute('href')
        self.browser.get(example_link)
        self.check_for_page_title('HiFiDraw Examples')

    def test_is_a_github_link(self):
        github_link_element = self.browser.find_element_by_id('id_github_link')

        # User .get_attribute instead of .text because the element may be hidden in the nav bar collapsible
        github_link_text = github_link_element.get_attribute('textContent')
        self.assertEqual(github_link_text, 'GitHub')

        github_link = github_link_element.get_attribute('href')
        self.assertTrue('github' in github_link)


if __name__ == '__main__':
    unittest.main()
